import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
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
	variant: "solid",
	mx: 0.5,
};

export const PostComponent: React.FC<PostProps> = ({ post }) => {
	const [{ fetching }, vote] = useVoteMutation();
	const updoots = useState(0);

	return (
		<Flex
			key={`post-${post.id}-container`}
			p={5}
			shadow="md"
			borderWidth="1px"
			flexDirection="row"
		>
			<Flex color="gray.600" fontSize="sm" flexDirection="column" alignItems="center" marginRight={"3.5"}>
				<Box>
					<IconButton
						aria-label="updoot button"
						icon={<BiUpvote />}
						{...iconButtonOptions}
						isLoading={fetching}
						colorScheme={
							post.voteStatus === UpdootDirection.Up
								? "blue"
								: undefined
						}
						onClick={() => {
							if (post.voteStatus !== UpdootDirection.Up) {
								vote({
									direction: UpdootDirection.Up,
									postId: post.id,
								});
							}
						}}
					/>
				</Box>
				<Box>{post.points}</Box>
				<Box>
					<IconButton
						aria-label="downdoot button"
						icon={<BiDownvote />}
						{...iconButtonOptions}
						isLoading={fetching}
						colorScheme={
							post.voteStatus === UpdootDirection.Down
								? "orange"
								: undefined
						}
						onClick={() => {
							if (post.voteStatus !== UpdootDirection.Down) {
								vote({
									direction: UpdootDirection.Down,
									postId: post.id,
								});
							}
						}}
					/>
				</Box>
			</Flex>
			<Box>
				<Heading fontSize="xl">{post.title}</Heading>
				<Text mt={4}>{post.textSnippet}</Text>
				<p>
					by {post.author.username} on {formatDate(post.createdAt)}
				</p>
			</Box>
		</Flex>
	);
};
