import React from "react";
import { Form, Formik } from "formik";
import { Button, Box } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

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
						</Box>
						<Button
							mt={4}
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

export default Login;
