import { useSelector } from "react-redux"
import { RootState } from "../state/store"
import { useParams } from "react-router-dom";

export const ProductPage = () => {
        const { DeviceId } = useParams(); 
        const devices = useSelector((state:RootState)=>state.device.devices);
    return(
        <div>

        </div>
    )
}