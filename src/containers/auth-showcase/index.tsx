import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {Button} from "~/components/buttons/button";
import Image from "next/image";
import { AuthorisedContainer, AuthShowcaseContainer } from "~/containers/auth-showcase/styles/auth-showcase.styles";

export const AuthShowcase: React.FC = () => {
	const {data: sessionData} = useSession();
	console.log('sessionData', sessionData)

	return (
		<AuthShowcaseContainer>
			{!sessionData && (
				<Button onClick={() => void signIn()}>
					Sign in
				</Button>
			)}
			{sessionData && (
				<AuthorisedContainer>
					{sessionData?.user?.image && (
						<>
							<Image
								alt="Avatar"
								src={sessionData.user.image}
								height={40}
								width={40}
								style={{
									objectFit: 'cover',
									borderRadius: 50
								}}
							/>
							<img width={50} height={50} alt={'test'} src={sessionData.user.image}/>
						</>
					)}
					<Button onClick={() => void signOut()}>
						Sign out
					</Button>
				</AuthorisedContainer>
			)}
		</AuthShowcaseContainer>
	);
};
