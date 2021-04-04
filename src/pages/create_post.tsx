import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePost: React.FC = ({}) => {
    const [, createPost] = useCreatePostMutation()
	return (
		<React.Fragment>
			<NavBar />
			<Wrapper variant="small">
				<Formik
					initialValues={{ title: "", text: "" }}
					onSubmit={async (values) => {
						const resposne = await createPost(values);
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

export default withUrqlClient(createUrqlClient)(CreatePost)