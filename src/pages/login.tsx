import React from "react";
import { Form, Formik } from "formik";
import { Button, Box, Link } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const Login: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [, login] = useLoginMutation();
	return (
		<Wrapper>
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values);
					if (response.data?.login.errors) {
						const errors = toErrorMap(response.data.login.errors);
						setErrors(errors);
					} else if (response.data?.login.user) {
						//register success!
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box my={4}>
							<InputField
								name="username"
								placeholder="username"
								label="Username"
							/>
							<InputField
								name="password"
								placeholder="password"
								label="Password"
								type="password"
							/>
							<NextLink href="forgot_password">
								<Link colorScheme="blue">
									I forgot my password
								</Link>
							</NextLink>
						</Box>
						<Button
							mt={1}
							type="submit"
							isLoading={isSubmitting}
							colorScheme="teal"
						>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
