import ReactFlow, { ReactFlowProvider, Controls, Background, MarkerType } from 'reactflow'
import { ToastContainer } from 'react-toastify';
import MessageNode from '../components/MessageNode';
import Sidebar from '../components/Sidebar';
import useWorkflow from './hooks/useWorkflow';
import 'reactflow/dist/style.css';

const nodeTypes = { 
    messageNode: MessageNode
}

const Workflow = () => {
    const {
        states: {
            reactFlowWrapper,
            nodes,
            edges,
            selectedNodeId,
        }, 
        functions: {
            onNodesChange,
            onEdgesChange,
            setReactFlowInstance,
            onConnect,
            onEdgeUpdate,
            onDragOver,
            onDrop,
            onNodeClick,
            setSelectedNodeId,
            setNodes,
            handleSave
        }
    } = useWorkflow();    

    return (
        <ReactFlowProvider>
            <header className='bg-gray-100 p-4 text-end'>
                <button className='py-2 px-6 text-[#535E8B] font-bold border-[#535E8B] border rounded-md' onClick={handleSave}>Save Changes</button>
            </header>
            <main className='flex'>
                <div className='h-screen w-3/4' ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        onNodesChange={onNodesChange}
                        edges={edges?.map(i => ({...i, markerEnd: { type: MarkerType.ArrowClosed }}))}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        onInit={setReactFlowInstance}
                        onConnect={onConnect}
                        onEdgeUpdate={onEdgeUpdate}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onNodeClick={onNodeClick}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
                <Sidebar isNodeSelected={Boolean(selectedNodeId)} setSelectedNodeId={setSelectedNodeId} nodes={nodes} nodeId={selectedNodeId} setNodes={setNodes}/>
            </main>
            <ToastContainer 
                position='top-center'
                autoClose={2000}
                closeButton={false}
                theme='colored'
                hideProgressBar={true}
            />
        </ReactFlowProvider>
    )
}

export default Workflow