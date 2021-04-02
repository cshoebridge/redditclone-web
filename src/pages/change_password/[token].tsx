import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

interface changePasswordProps {}

const ChangePassword: React.FC<changePasswordProps> = ({}) => {
	const [, changePassword] = useChangePasswordMutation();

	const router = useRouter();
	const token = router.query.token as string;

	return (
		<Wrapper>
			<Formik
				initialValues={{ password: "" }}
				onSubmit={async ({ password }, { setErrors }) => {
					const response = await changePassword({
						token,
						newPassword: password,
					});
					if (
						response.data &&
						!response.data.changePassword.success
					) {
						const errors = toErrorMap([
							{
								field: response.data.changePassword.field,
								message: response.data.changePassword.message,
							},
						]);
						console.log(errors)
						setErrors(errors);
					} else {
						alert(
							"password changed successfully! Redirecting to home page..."
						);
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box my={4}>
							<InputField
								name="password"
								placeholder="new password"
								label="New Password"
								type="password"
							/>
						</Box>
						<Button
							mt={1}
							type="submit"
							isLoading={isSubmitting}
							colorScheme="teal"
						>
							Change Password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
