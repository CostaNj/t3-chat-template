import { styled } from '@linaria/react'

export const Button = styled.button`
	height: 40px;
	padding: 10px 20px;
	border: none;
	border-radius: 15px;
	background-color: rgb(255, 255, 255, 0.1);
	color: darkgray;

	&:hover {
		background-color: rgb(255, 255, 255, 0.2);
	}
`
