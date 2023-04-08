import { styled } from "@linaria/react";

export const ChatInputsContainer = styled.section`
	display: flex;
	gap: 10px;
	align-items: center;
`
export const MessagesBox = styled.div`
	height: 400px;
	width: 260px;
	overflow: scroll;
	margin-bottom: 30px;
`
export const MessageContainer = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 20px;
`

export const Message = styled.div`
	width: 260px;
	min-height: 40px;
	margin-left: 26px;
	background-color: rgb(255, 255, 255, 0.1);
	position: relative;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex-wrap: wrap;
	color: darkgray;
	padding: 0 20px;


	&:before {
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		right: 100%;
		bottom: 12px;
		border-top: 8px solid transparent;
		border-right: 16px solid rgb(255, 255, 255, 0.1);
		border-bottom: 8px solid transparent;
	}
`
