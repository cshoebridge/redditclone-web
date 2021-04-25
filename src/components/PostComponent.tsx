import { Box, Heading, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
	RegularPostFragment,
	UpdootDirection,
	useVoteMutation,
	VoteMutationVariables,
} from "../generated/graphql";
import { formatDate } from "../utils/formatDate";
import { BiDownvote, BiUpvote } from "react-icons/bi";

interface PostProps {
	post: RegularPostFragment;
}

const iconButtonOptions = {
	variant: "ghost",
	mx: 0.5,
};

export const PostComponent: React.FC<PostProps> = ({ post }) => {
	const [{ fetching }, vote] = useVoteMutation();
	const updoots = useState(0);

	return (
		<Box
			key={`post-${post.id}-container`}
			p={5}
			shadow="md"
			borderWidth="1px"
		>
			<Heading fontSize="xl">{post.title}</Heading>
			<Text mt={4}>{post.textSnippet}</Text>
			<Box color="gray.600" fontSize="sm">
				<p>
					by {post.author.username} on {formatDate(post.createdAt)}
				</p>
				<p>
					<IconButton
						aria-label="updoot button"
						icon={<BiUpvote />}
						{...iconButtonOptions}
						isLoading={
							fetching
						}
						onClick={() =>
							vote({
								direction: "UP" as UpdootDirection,
								postId: post.id,
							})
						}
					/>
					{post.points}
					<IconButton
						aria-label="downdoot button"
						icon={<BiDownvote />}
						{...iconButtonOptions}
						isLoading={
							fetching
						}
						onClick={() =>
							vote({
								direction: "DOWN" as UpdootDirection,
								postId: post.id,
							})
						}
					/>
				</p>
			</Box>
		</Box>
	);
};
