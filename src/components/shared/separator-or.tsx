 import {ReactNode} from 'react'

const SeparatorWithOr = ({children}: {children?: ReactNode})=>{
 return(
    <div className='h-5 border-b my-5 text-center w-full'>
     <span className='bg-background absolute left-1/2 -translate-x-1/2 mt-2 text-gray-500'>
      {children ?? 'or'}
      
         {/* let value1 = null ?? 'default'; // 'default'
         let value2 = undefined ?? 'default'; // 'default'
         let value3 = '' ?? 'default'; // '' (empty string is kept)
         let value4 = false ?? 'default'; // false (false is kept) */}

     </span>
    </div>
 )
}
export default SeparatorWithOr