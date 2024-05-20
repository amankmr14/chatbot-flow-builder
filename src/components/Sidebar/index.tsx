import React, { useEffect, useState } from 'react'
import { BsChatText } from 'react-icons/bs'
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Node } from 'reactflow';

type Props = {
    isNodeSelected: Boolean;
    nodeId: string;
    nodes: Node[];
    setSelectedNodeId: React.Dispatch<React.SetStateAction<string>>;
    setNodes: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>;
}

const Sidebar = ({ isNodeSelected, nodeId, nodes, setSelectedNodeId, setNodes }: Props) => {
    const [textContent, setTextContent] = useState('');

    const getNodeTextValue = () => nodes?.find(node => node.id === nodeId)?.data?.textContent

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    node.data = {
                        ...node.data,
                        textContent: textContent,
                    };
                }
                return node;
            })
        );
    }, [textContent, setNodes]);

    return (
        <aside className='h-screen w-1/4 border border-gray border-t-2 border-l-2'>
            {isNodeSelected ? (
                <>
                    <div className='border-gray border-0 border-b-2 p-3 flex items-center'>
                        <IoMdArrowRoundBack className='opacity-80 cursor-pointer' onClick={() => setSelectedNodeId('')} />
                        <div className='flex-1 text-center font-semibold opacity-80'>Message</div>
                    </div>
                    <div className='border-gray border-0 border-b-2 p-3 flex flex-col'>
                        <label htmlFor='node-message' className='text-gray-400 py-2'>Text</label>
                        <textarea id='node-message' className='border border-gray rounded-lg focus:outline-none p-3 opacity-80 font-semibold' value={getNodeTextValue()} onChange={(event) => setTextContent(event.target.value)} />
                    </div>
                </>
            ) : (
                <div
                    className='border border-[#535E8B] m-2 p-4 flex flex-col justify-center items-center w-1/2 text-[#535E8B] font-semibold rounded'
                    onDragStart={(event) => onDragStart(event, 'messageNode')}
                    draggable
                >
                    <BsChatText />
                    Message
                </div>
            )}
        </aside>
    )
}

export default Sidebar