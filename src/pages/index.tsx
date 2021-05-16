import {
	Button,
	Stack,
	Text
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { PostPreview } from "../components/PostPreview";
import Wrapper from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
	const [queryVars, setQueryVars] = useState({
		limit: 25,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({ variables: queryVars });

	return (
			<Layout>
			<Wrapper>
				{fetching && !data ? (
					"Loading..."
				) : (
					<Stack spacing={8} mt="4%" mb="7%">
						<Text fontSize="4xl" fontWeight="bold">
							Posts
						</Text>
						{data?.posts.posts.map((post) => (
							<PostPreview post={post} />
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
			</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
