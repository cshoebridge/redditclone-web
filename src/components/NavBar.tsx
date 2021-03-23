import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery();
	console.log(data);
	let body;
	if (fetching) {
		body = null;
	} else if (!data?.me.user?.id) {
		body = (
			<React.Fragment>
				<NextLink href="login">
					<Link mr="4">
						Login
					</Link>
				</NextLink>
				<NextLink href="register">
					<Link  mr="4">
						Register
					</Link>
				</NextLink>
			</React.Fragment>
		);
	} else {
        body = (
            <Flex>
                <Box mr="4">{data.me.user?.username}</Box>
                <Box mr="4"><Button variant="link">Logout</Button></Box>
            </Flex>
        )
    }

	return (
		<Flex color="black" fontWeight="bold" bg="tan" py="4">
			<Box ml="auto">{body}</Box>
		</Flex>
	);
};