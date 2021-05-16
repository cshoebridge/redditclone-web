import { Box, Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { FullPost } from "../../components/FullPost";
import { Layout } from "../../components/Layout";
import { PostPreview } from "../../components/PostPreview";
import Wrapper from "../../components/Wrapper";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post = () => {
	const router = useRouter();
	const postId = router.query.postid;
	const intId = typeof postId === "string" ? parseInt(postId) : -1;

	const [{ data, fetching }] = usePostQuery({
		pause: intId === -1,
		variables: { id: intId },
	});

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
