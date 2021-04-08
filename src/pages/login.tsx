import React from "react";
import { Form, Formik } from "formik";
import { Button, Box, Link } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { FieldError, toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";

const Login: React.FC<{}> = ({}) => {
	const router = useRouter();
	const { next } = router.query;
	const [, login] = useLoginMutation();
	return (
		<React.Fragment>
			<NavBar />
			<Wrapper>
				<Formik
					initialValues={{ username: "", password: "" }}
					onSubmit={async (values, { setErrors }) => {
						const response = await login(values);
						if (response.data?.login.errors) {
							const errors = toErrorMap(
								response.data.login.errors
							);
							setErrors(errors);
						} else if (response.data?.login.user) {
							//login success!
							if (typeof next !== "string") {
								router.replace("/");
							} else {
								router.replace(next);
							}
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Box my={4}>
								<InputField
									name="username"
									placeholder="username"
									label="Username / Email"
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
		</React.Fragment>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
