import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
	Post,
	RegularPostFragment,
	UpdootDirection,
	useVoteMutation,
	VoteMutationVariables,
} from "../generated/graphql";
import { formatDate } from "../utils/formatDate";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { UpdootWidget } from "./UpdootWidget";

interface PostProps {
	post: RegularPostFragment & Pick<Post, "text">;
}

export const FullPost: React.FC<PostProps> = ({ post }) => {
	const updoots = useState(0);

	return (
		<>
            <Flex w="100%" bgColor="blackAlpha.600" textColor="white" justifyContent="center">
				<UpdootWidget post={post} direction={"row"} />
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
