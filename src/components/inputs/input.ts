import { styled } from '@linaria/react'

export const Input = styled.input`
	height: 32px;
	padding: 4px 20px;
	border: none;
	border-radius: 15px;
	background-color: rgb(255, 255, 255, 0.1);
	color: darkgray;

	&:hover {
		background-color: rgb(255, 255, 255, 0.2);
	}

	::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
		color: darkgray;
		opacity: 1; /* Firefox */
	}

	:-ms-input-placeholder { /* Internet Explorer 10-11 */
		color: darkgray;
	}

	::-ms-input-placeholder { /* Microsoft Edge */
		color: darkgray;
	}
`
