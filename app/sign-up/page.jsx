'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import setData from '@/helpers/setData'
import { createNewUser } from '@/queries/Users'

function SignUp(){
	//активируем мутацию создания пользователя
	const signUpMutation = useMutation({
		mutationFn: (newUser) => {		
			setData(createNewUser, { data: newUser }, '/system').then((response) =>{ //'/system' - значение для второго аргумента - additionalPath функции setData
				console.log(response)
			}
			)
		},
		mutationKey: ['signUpUser']	
	})

	//функция handleSubmit активируется при отправке формы по нажатию на кнопку типа input
	const handleSubmit = (e) =>{	
		e.preventDefault()
		console.log(e.target.password.value)
		signUpMutation.mutate({//передать в мутацию создания пользователя значения для data			
			email: e.target.email.value, //значение емайла из инпута
			password: e.target.password.value, //значение пароля из инпута
			role: 'ca8effef-24a7-470a-9cc3-922c3fc5024e', //id роли - 'Customer'
			status: 'active',
			provider: 'default',
		})
	}

	return (
		<div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<form
					className='mt-8 space-y-6'
					noValidate
					onSubmit={ (e) => handleSubmit(e) }
				>
					{/* <form className="mt-8 space-y-6" noValidate > */ }
					<div className='rounded-md shadow-sm -space-y-px'>
						<div>
							{/* Свойство HTMLLabelElement.htmlFor отражает значение свойства for content. Это означает, что это доступное для сценария свойство используется для установки и чтения значения свойства содержимого, которое является идентификатором связанного с меткой элемента управления. */ }
							<label htmlFor='email-address'	className='sr-only'	>Email address</label>
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
							Sign up
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default SignUp
