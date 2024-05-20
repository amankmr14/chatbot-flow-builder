import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { useNodesState, useEdgesState, Node, Edge, addEdge, Connection, updateEdge } from 'reactflow'

const initialNodes: Node[] = [
    { id: 'node-1', type: 'messageNode', position: { x: 100, y: 100 }, data: { textContent: 'text message 1' } },
];

const intitialEdges: Edge[] = [];

const useWorkflow = () => {
    const reactFlowWrapper = useRef(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(intitialEdges)
    const [reactFlowInstance, setReactFlowInstance] = useState<any>();
    const [selectedNodeId, setSelectedNodeId] = useState('');
    

    // For connecting the source handle and target handle
    const onConnect = useCallback(
        (connection: Connection) => {
            //updating the edges
            setEdges(oldEdges => addEdge(connection, oldEdges))
        },
        [edges]
    )

    // For handling drag in the react flow area
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);


    // For toggling between the node menu and the edit menu
    const onNodeClick = (_event: any, node: Node) => {
        if (selectedNodeId === node.id) {
            setSelectedNodeId('')
        } else {
            setSelectedNodeId(node.id)
        }
    }

    // For adding a new node when dropping an item from the node menu
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            // Prevent the default behavior of the drag event
            event.preventDefault();

            // Get the type of the dropped item from the data transfer
            const type = event.dataTransfer.getData('application/reactflow');

            // Return if the dropped item type is undefined or empty
            if (typeof type === 'undefined' || !type) {
                return;
            }

            // Convert screen coordinates to flow position
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // Create a new node with an incremented ID and position
            const newNode = {
                id: `node-${reactFlowInstance.getNodes().length + 1}`,
                type,
                position,
                data: { textContent: `text message ${reactFlowInstance.getNodes().length + 1}` }
            };
             // Add the new node to the nodes state
            setNodes((prevNodes) => prevNodes.concat(newNode))
        },
        [reactFlowInstance]
    )

    // For updating the edges
    const onEdgeUpdate = useCallback(
        (oldEdge: Edge, newConnection: Connection) => setEdges((prev) => updateEdge(oldEdge, newConnection, prev)),
        []
    );

    const isValidFlow = () => {
        const mapTargetSet = new Set(edges.map(e => e.target));
        const mapSourceSet = new Set(edges.map(e => e.source));
        // Create a Set containing the IDs of nodes without target handles
        const noTargetNodeIds = new Set(nodes?.filter(n => !mapTargetSet.has(n.id)).map(n => n.id));

        // Validation fails if more than one node lacks a target handle
        if (noTargetNodeIds.size > 1) return false;

        // If only one node has a target handle, verify if it has a source handle
        if (noTargetNodeIds.size > 0 && !mapSourceSet.has(Array.from(noTargetNodeIds)[0])) return false;
        
        return true;
    };      

    const handleSave = () => {
        if (reactFlowInstance) {
            const isValid = isValidFlow();
            const flow = reactFlowInstance.toObject();
            if(isValid) {
                localStorage.setItem('chatbot-data', JSON.stringify(flow))
                toast("Flow Saved Successfully", {
                    type: 'success',
                })
            } else {
                toast("Cannot Save Flow", {
                    type: 'error'
                })
            }
        }
    }

    useEffect(() => {
        // Function to restore the flow from local storage
        const restoreFlow = () => {
            // Retrieve chatbot data from local storage or set it to an empty string if not found
            let chatbotData = localStorage?.getItem('chatbot-data') || ""
            const flow = chatbotData ? JSON.parse(chatbotData) : null;

            // If flow data exists, set nodes, edges, and viewport of the React Flow instance
            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                // Set viewport of the React Flow instance
                reactFlowInstance?.setViewport({ x, y, zoom });
            }
        };

        restoreFlow()
    }, [])

    return {
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
    }
}

export default useWorkflow