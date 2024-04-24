//Страница - форма подтверждения входа в сиситему

'use client'

import { getCsrfToken, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function SignInForm() {

	// const csrfToken = getCsrfToken()

	const router = useRouter()
	const [ error, setError ] = useState(false)

	//функция handleSubmit активируется при отправке формы по нажатию на кнопку типа input
	
	const handleSubmit = async (e) =>{	
		e.preventDefault()
		
		const res = await signIn('credentials', { //signIn - Клиентский метод для инициации процесса входа или отправки пользователя на страницу входа со списком всех возможных поставщиков. Автоматически добавляет токен CSRF в запрос.
			redirect: false,
			email: e.target.email.value,
			password: e.target.password.value,
			callbackUrl: `/user-area`,//callbackUrl - свойство метода signIn для пренаправления на страницу пользователя '/user-area'
		  });
	  
		  if (res?.error) {//если ответ ошибочен
			setError(true);//состояние для error переведёт в true
		  } else {//иначе:
			router.push('/user-area');//пренаправит на страницу пользователя '/user-area'
		  }
		
	}

	return (
		<div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<form
					className='mt-8 space-y-6'
					noValidate
					onSubmit={handleSubmit}//при отправке формы активируем функцию handleSubmit
				>
					{/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
					{/* <form className="mt-8 space-y-6" noValidate > */ }
					<div className='rounded-md shadow-sm -space-y-px'>
						<div>
							{/* Свойство HTMLLabelElement.htmlFor отражает значение свойства for content. Это означает, что это доступное для сценария свойство используется для установки и чтения значения свойства содержимого, которое является идентификатором связанного с меткой элемента управления. */ }
							<label htmlFor='email-address' className='sr-only'>	Email address </label>
							<input
								id='email-address'
								name='email'
								type='email'
								autoComplete='email'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
								placeholder='Email address'
							/>
						</div>
						<div>
							<label
								htmlFor='password'
								className='sr-only'
							>
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
								placeholder='Password'
							/>
						</div>
					</div>

					<div>
						<button
							type='submit'
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
						>
							Sign in
						</button>
					</div>
					
				</form>
				{error && <div className="bg-red-300 p-2 text-white rounded">Wrong email or password</div>}
			</div>
		</div>
	)
}

export default SignInForm
