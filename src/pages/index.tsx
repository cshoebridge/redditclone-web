import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { title } from "node:process";
import React from "react";
import { NavBar } from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
	const [{ data, fetching }] = usePostsQuery({
		variables: {
			limit: 10,
		},
	});
	return (
		<React.Fragment>
			<NavBar />
			<Wrapper>
				{fetching || !data ? (
					"Loading..."
				) : (
					<Stack spacing={8}>
						{data.posts.map((post) => (
							<Box
								key={`post-${post.id}-container`}
								p={5}
								shadow="md"
								borderWidth="1px"
							>
								<Heading fontSize="xl">{post.title}</Heading>
								<Text mt={4}>
									{post.textSnippet}
								</Text>
							</Box>
						))}
					</Stack>
				)}
			</Wrapper>
		</React.Fragment>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
