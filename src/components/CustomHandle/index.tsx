import { Handle, HandleProps } from 'reactflow'

const CustomHandle = (props: HandleProps) => {
  return <Handle className='h-2 w-2' {...props} />
}

export default CustomHandle