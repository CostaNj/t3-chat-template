import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {Button} from "~/components/buttons/button";
import Image from "next/image";
import { AuthorisedContainer, AuthShowcaseContainer } from "~/containers/auth-showcase/styles/auth-showcase.styles";
import { DEFAULT_AVATAR } from "~/constants/providers";

export const AuthShowcase: React.FC = () => {
	const {data: sessionData} = useSession();
	const [src, setSrc] = React.useState(sessionData?.user?.image ?? DEFAULT_AVATAR);

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
							src={src}
							height={40}
							width={40}
							style={{
								objectFit: 'cover',
								borderRadius: 50
							}}
							placeholder="blur"
							blurDataURL={DEFAULT_AVATAR}
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
