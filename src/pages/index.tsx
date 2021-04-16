import { Box, Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { formatDate } from "../utils/formatDate";

const Index = () => {
	const [queryVars, setQueryVars] = useState({
		limit: 25,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({ variables: queryVars });

	return (
		<React.Fragment>
			<NavBar />
			<Wrapper>
				{fetching && !data ? (
					"Loading..."
				) : (
					<Stack spacing={8} mt="4%" mb="7%">
						<Text fontSize="4xl" fontWeight="bold">
							Posts
						</Text>
						{data?.posts.posts.map((post) => (
							<Box
								key={`post-${post.id}-container`}
								p={5}
								shadow="md"
								borderWidth="1px"
							>
								<Heading fontSize="xl">{post.title}</Heading>
								<Text mt={4}>{post.textSnippet}</Text>
								<Box color="gray.600" fontSize="sm">
									by {post.author.username} on {formatDate(post.createdAt)}
								</Box>
							</Box>
						))}
						{data && !data.posts.allFetched ? (
							<Button
								width="100%"
								onClick={() => {
									setQueryVars((prev) => ({
										...prev,
										cursor:
											data.posts.posts[
												data.posts.posts.length - 1
											].createdAt,
									}));
								}}
								isLoading={fetching}
							>
								Load more
							</Button>
						) : null}
					</Stack>
				)}
			</Wrapper>
		</React.Fragment>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
