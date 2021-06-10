import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";
import { toErrorMap } from "../utils/toErrorMap";

const CreatePost: React.FC = ({}) => {
	const router = useRouter();
	useIsAuth();

	const [, createPost] = useCreatePostMutation();
	return (
		<Layout>
			<Wrapper variant="small">
				<Formik
					initialValues={{ title: "", text: "" }}
					onSubmit={async (values, { setErrors }) => {
						const response = await createPost(values);
						if (response.data?.createPost.errors) {
							const errors = toErrorMap(
								response.data.createPost.errors
							);
							setErrors(errors);
						} else if (response.data?.createPost.post) {
							router.push("/");
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
								Create Post
							</Button>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);
