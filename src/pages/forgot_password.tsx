import { Box, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface forgot_passwordProps {}

const ForgotPassword: React.FC<forgot_passwordProps> = ({}) => {
	const router = useRouter();
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<Wrapper>
			<Formik
				initialValues={{ email: "" }}
				onSubmit={async ({ email }) => {
                    const response = await forgotPassword({ email })
                    alert(response.data?.forgotPassword.message);
                    router.push("/login");
                }}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box my={4}>
							<InputField
								name="email"
								placeholder="email"
								label="Email Address"
							/>
						</Box>
						<Button
							mt={1}
							type="submit"
							isLoading={isSubmitting}
							colorScheme="teal"
						>
							Send Password Reset Email
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
