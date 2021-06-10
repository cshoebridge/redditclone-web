import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
	Post,
	RegularPostFragment,
	useDeletePostMutation,
	useMeQuery,
	useVoteMutation,
} from "../generated/graphql";
import { formatDate } from "../utils/formatDate";
import { isAuthor } from "../utils/isAuthor";
import { EditDeleteButtonWidget } from "./EditDeleteButtonWidget";
import { UpdootWidget } from "./UpdootWidget";

interface PostProps {
	post: RegularPostFragment & Pick<Post, "textSnippet">;
}

const iconButtonOptions = {
	variant: "solid",
	mx: 0.5,
};

export const PostPreview: React.FC<PostProps> = ({ post }) => {
	const [{ data: meData, fetching: fetchingMe }] = useMeQuery();

	return (
		<Flex
			key={`post-${post.id}-container`}
			p={5}
			shadow="md"
			borderWidth="1px"
			flexDirection="row"
		>
			<UpdootWidget post={post} flexDirection={"column"} />
			<Box>
				<Heading fontSize="xl">
					<NextLink href={`post/${post.id}`}>
						<Link>{post.title}</Link>
					</NextLink>
				</Heading>
				<Text mt={4}>{post.textSnippet}</Text>
				<p>
					by {post.author.username} on {formatDate(post.createdAt)}
				</p>

				{meData?.me.user?.id === post.author.id ? (
					<EditDeleteButtonWidget id={post.id} />
				) : null}
			</Box>
		</Flex>
	);
};
