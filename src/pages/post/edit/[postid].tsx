import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import Wrapper from "../../../components/Wrapper";
import { usePostQuery, useUpdatePostMutation } from "../../../generated/graphql";
import { useGetPostIdFromUrl } from "../../../hooks/useGetPostIdFromUrl";
import { useIsAuth } from "../../../hooks/useIsAuth";
import { useIsAuthor } from "../../../hooks/useIsAuthor";
import { toErrorMap } from "../../../utils/toErrorMap";
import { createUrqlClient } from "./../../../utils/createUrqlClient";

const EditPost: React.FC = ({}) => {
	const router = useRouter();
	useIsAuth();
	const intId = useGetPostIdFromUrl();
	useIsAuthor(intId);

	const [{data, fetching}] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	});;

	const [, updatePost] = useUpdatePostMutation();

	if (fetching) {
		return (
			<h1>Loading</h1>
		)
	}

	if (!data?.post) {
		return (
			<h1>Could not find post</h1>
		)
	}

	return (
		<Layout>
			<Wrapper variant="small">
				<Formik
					initialValues={{ title: data.post.title, text: data.post.text }}
					onSubmit={async (values, { setErrors }) => {
						const response = await updatePost({
							id: intId,
							...values,
						});
						if (response.data?.updatePost?.errors) {
							const errors = toErrorMap(
								response.data.updatePost.errors
							);
							setErrors(errors);
						} else if (response.data?.updatePost?.post) {
							router.back();
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Box my={4}>
								<InputField
									name="title"
									placeholder="Title"
									label="Post Title"
								/>
								<InputField
									name="text"
									placeholder="Text"
									label="Post Content"
									variant="area"
								/>
							</Box>
							<Button
								mt={1}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="teal"
							>
								Update Post
							</Button>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: false})(EditPost);
