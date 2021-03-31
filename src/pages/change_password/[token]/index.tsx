import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import Wrapper from "../../../components/Wrapper";

interface changePasswordProps {}

export const ChangePassword: React.FC<changePasswordProps> = ({}) => {
	const router = useRouter();
	const { token } = router.query;

	return (
		<Wrapper>
			<Formik
				initialValues={{ newPassword: "" }}
				onSubmit={async ({ newPassword }) => {}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box my={4}>
							<InputField
								name="newPassowrd"
								placeholder="new password"
								label="New Password"
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
