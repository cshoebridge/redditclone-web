import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import { useDeletePostMutation } from "../generated/graphql";
import NextLink from "next/link"

interface EditDeleteButtonWidgetProps {
    id: number
}

export const EditDeleteButtonWidget: React.FC<EditDeleteButtonWidgetProps> = ({id}) => {
        const [, deletePost] = useDeletePostMutation();
		return (
			<Box>
				<IconButton
					icon={<DeleteIcon />}
					aria-label="delete post"
					mt={1}
					mr={1}
					onClick={() => deletePost({ id })}
				/>
				<NextLink href={`/post/edit/${id}`}>
					<IconButton
						icon={<EditIcon />}
						aria-label="edit post"
						mt={1}
						ml={1}
					/>
				</NextLink>
			</Box>
		);
	};
