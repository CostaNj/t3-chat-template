import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {Button} from "~/components/buttons/button";
import Image from "next/image";
import { AuthorisedContainer, AuthShowcaseContainer } from "~/containers/auth-showcase/styles/auth-showcase.styles";
import { DEFAULT_AVATAR } from "~/constants/providers";

export const AuthShowcase: React.FC = () => {
	const { data: sessionData, status } = useSession();
	const [src, setSrc] = React.useState<string | null>(null);

	console.log('sessionData', sessionData)
	if(status === 'loading') {
		console.log('loading')
		return null
	}

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
						<Image
							alt="Avatar"
							src={src ?? sessionData?.user?.image}
							height={40}
							width={40}
							style={{
								objectFit: 'cover',
								borderRadius: 50
							}}
							onError={() => setSrc(DEFAULT_AVATAR)}
						/>
					)}
					<Button onClick={() => void signOut()}>
						Sign out
					</Button>
				</AuthorisedContainer>
			)}
		</AuthShowcaseContainer>
	);
};
