import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

const CreatePost: React.FC = ({}) => {
	const [, createPost] = useCreatePostMutation();
	const router = useRouter();
	return (
		<React.Fragment>
			<NavBar />
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
		</React.Fragment>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);
