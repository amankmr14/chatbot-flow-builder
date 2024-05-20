import { NodeProps, Position } from "reactflow"
import { BsChatText } from "react-icons/bs";
import { RiWhatsappFill } from "react-icons/ri";
import CustomHandle from "../CustomHandle";

const MessageNode = ({data: { textContent }}: NodeProps<{ textContent: string }>) => {
    return (
        <>
            <div className="shadow-lg w-[300px] rounded-lg">
                <p className="bg-[#B2F0E3] border border-b py-1 rounded-t-lg flex items-center">
                    <span className="px-3"><BsChatText/></span>
                    <span className="font-bold opacity-70">Send Message</span>
                    <span className="flex-1 px-3"><RiWhatsappFill fill="green" className="float-right"/></span>
                </p>
                <p className="py-2 px-3 min-h-[55px] rounded-b-lg font-semibold opacity-80 bg-white">
                    {textContent}
                </p>
            </div>
            <CustomHandle type="target" position={Position.Left}/>
            <CustomHandle type="source" position={Position.Right}/>
        </>
    )
}

export default MessageNode