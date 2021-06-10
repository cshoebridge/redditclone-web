import { Flex, Box, IconButton } from "@chakra-ui/react";
import React from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import {
	Post,
	RegularPostFragment,
	UpdootDirection,
	useVoteMutation,
} from "../generated/graphql";

interface UpdootWidgetProps {
	post: RegularPostFragment & (Pick<Post, "text"> | Pick<Post, "textSnippet">);
    flexDirection: "column" | "row"
}

const iconButtonOptions = {
	variant: "solid",
	mx: 0.5,
};

export const UpdootWidget: React.FC<UpdootWidgetProps> = ({ post, flexDirection }) => {
	const [{ fetching }, vote] = useVoteMutation();
	return (
		<Flex
			color="gray.600"
			fontSize="sm"
			flexDirection={flexDirection}
			alignItems="center"
			marginRight={"3.5"}
		>
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
	);
};
