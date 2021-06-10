import { Box, Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { FullPost } from "../../components/FullPost";
import { Layout } from "../../components/Layout";
import { useGetPostFromUrl } from "../../hooks/useGetPostFromUrl";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post = () => {
	const [{data, fetching}] = useGetPostFromUrl();

	if (fetching) {
		return <h1>Loading</h1>;
	}

	const post = data?.post;
	if (!post || fetching) {
		return <h1>Some sort of 404 screen</h1>;
	}

	return (
		<Layout>
			<Flex mx="15%" flexDirection="column">
				<FullPost post={post} />
			</Flex>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
