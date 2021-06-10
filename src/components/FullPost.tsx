import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
	Post,
	RegularPostFragment,
	UpdootDirection,
	useMeQuery,
	useVoteMutation,
	VoteMutationVariables,
} from "../generated/graphql";
import { formatDate } from "../utils/formatDate";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { UpdootWidget } from "./UpdootWidget";
import { EditDeleteButtonWidget } from "./EditDeleteButtonWidget";
import { useGetIsAuthor } from "../hooks/useGetIsAuthor";

interface PostProps {
	post: RegularPostFragment & Pick<Post, "text">;
}

export const FullPost: React.FC<PostProps> = ({ post }) => {
	const [{ data: meData, fetching: fetchingMe }] = useMeQuery();

	return (
		<>
			<Flex
				w="100%"
				bgColor="blackAlpha.600"
				textColor="white"
				justifyContent="center"
			>
				<UpdootWidget post={post} flexDirection={"row"} />
				{meData?.me?.user?.id === post.author.id ? (
					<EditDeleteButtonWidget id={post.id} />
				) : null}
			</Flex>
			<Flex
				key={`post-${post.id}-container`}
				flexDirection="column"
				bgColor="lightgray"
				alignItems="left"
				px="5%"
				py="2%"
			>
				<Box borderRadius="5" p="3" bgColor="white" mr="40%">
					<Box>
						<Heading fontSize="lg">
							by {post.author.username} on{" "}
							{formatDate(post.createdAt)}
						</Heading>
						<Heading fontSize="4xl">{post.title}</Heading>
					</Box>
					<Text fontSize="lg" my={4}>
						{post.text}
					</Text>
				</Box>
			</Flex>
		</>
	);
};
