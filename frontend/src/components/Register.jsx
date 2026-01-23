import LiquidGlassButton from './LiquadButton'

const Register = () => {
  return (
    <div className='p-5 bg-gray-100 shadow-md rounded-lg max-w-md mx-auto mt-20'>
      <h2 className='text-center text-4xl font-semibold'>Get Started</h2>
      <form action="">  
        <div className='my-3 flex flex-col'>
          <label htmlFor="name">Name</label>
          <input autoComplete='off' className='outline-none px-3 py-2 border border-gray-300 rounded-md mx-2' name='name' type="text" placeholder='Your Name' />
        </div>
        <div className='my-3 flex flex-col'>
          <label htmlFor="email">Email</label>
          <input autoComplete='off' className='outline-none px-3 py-2 border border-gray-300 rounded-md mx-2' name='email' type="text" placeholder='Your Name' />
        </div>
        <div className='my-3 flex flex-col'>
          <label htmlFor="password">Password</label>
          <input autoComplete='off' className='outline-none px-3 py-2 border border-gray-300 rounded-md mx-2' name='password' type="text" placeholder='Your Name' />
        </div>
        <LiquidGlassButton text={"Register"} />
      </form>
    </div>
  )
}

export default Register