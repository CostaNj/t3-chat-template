import { styled } from '@linaria/react'

export const Container = styled.main`

	min-height: 100vh;
	width: 100%;
	background-image: linear-gradient(to bottom, #2e026d, #15162c);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	@media (min-width: 640px) {
		max-width: 640px;
	}

	@media (min-width: 768px) {
		max-width: 768px;
	}

	@media (min-width: 1024px) {
		max-width: 1024px;
	}


	@media (min-width: 1280px) {
		max-width: 1280px;
	}

	@media (min-width: 1536px) {
		max-width: 1536px;
	}
`
