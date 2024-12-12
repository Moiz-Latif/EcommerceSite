import { createSlice } from "@reduxjs/toolkit";

interface Device {
    DeviceId: string; // Unique identifier for the device
    Quantity: number; // Stock count of the device
    DeviceName: string; // Name of the device
    Brand: string; // Brand of the device
    Model: string; // Model of the device
    Category: string; // Category like Smartphone, Laptop, etc.
    Condition: string; // Condition of the device: New, Used, etc.
    Specifications: Record<string, string | Record<string, string>>; // Supports nested objects like the camera property
    Description: string; // Device description
    Images: string[]; // Array of image URLs
    SerialNumber: string; // Serial number should be a string
    Price: number; // Price in dollars
}

interface DeviceState {
    devices: Device[];
}

const initialState : DeviceState = {
    devices:[]
}

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        setDevices: (state , action) => {
            state.devices = action.payload;
        }
    }
})

export const { setDevices } = deviceSlice.actions;
export default deviceSlice.reducer;
