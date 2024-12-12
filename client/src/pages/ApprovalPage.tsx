"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface ApprovalRequest {
  id: string
  userName: string
  email: string
  deviceName: string
  deviceCategory: string
  requestDate: string
  status: "pending" | "approved" | "rejected"
}

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: "1",
      userName: "John Smith",
      email: "john.smith@example.com",
      deviceName: "iPhone 13 Pro",
      deviceCategory: "Mobile Phones",
      requestDate: "2024-01-15",
      status: "pending",
    },
    {
      id: "2",
      userName: "Sarah Johnson",
      email: "sarah.j@example.com",
      deviceName: "MacBook Pro M1",
      deviceCategory: "Laptops",
      requestDate: "2024-01-14",
      status: "pending",
    },
    {
      id: "3",
      userName: "Mike Wilson",
      email: "mike.w@example.com",
      deviceName: "Samsung Galaxy S21",
      deviceCategory: "Mobile Phones",
      requestDate: "2024-01-13",
      status: "pending",
    },
  ])

  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)

  const handleAction = (request: ApprovalRequest, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setAction(action)
    setIsDialogOpen(true)
  }

  const confirmAction = () => {
    if (selectedRequest && action) {
      setRequests(
        requests.map((request) =>
          request.id === selectedRequest.id
            ? { ...request, status: action === "approve" ? "approved" : "rejected" }
            : request
        )
      )
      setIsDialogOpen(false)
      setSelectedRequest(null)
      setAction(null)
    }
  }

  return (
    <div className="pl-56 pt-20 pr-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Seller Approval Requests</h1>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <AlertCircle className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap">{request.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium">{request.deviceName}</div>
                    <div className="text-sm text-gray-500">{request.deviceCategory}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{request.requestDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.status === "pending" && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAction(request, "approve")}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction(request, "reject")}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {action === "approve" ? "Approve Request" : "Reject Request"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {action} the seller request from{" "}
                        {selectedRequest?.userName}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmAction}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
