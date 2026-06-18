// src/features/admin-auth/infrastructure/auth-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { ChangePasswordInputDTO, LoginInputDTO, LoginResultDTO } from './dto';

type LoginVariables = {
  input: LoginInputDTO;
};

const LOGIN_MUTATION = `
  mutation Login($input: AuthLoginInput!) {
    login(input: $input) {
      accessToken refreshToken accountId role
      userInfo { id accountId nickname avatarUrl email }
    }
  }
`;

export async function loginWithPassword(input: {
  loginName: string;
  loginPassword: string;
}): Promise<LoginResultDTO> {
  const data = await executeGraphQL<{ login: LoginResultDTO }, LoginVariables>(
    LOGIN_MUTATION,
    {
      input: {
        loginName: input.loginName,
        loginPassword: input.loginPassword,
        type: 'PASSWORD',
        audience: 'DESKTOP',
      },
    },
    { authMode: 'none' },
  );

  return data.login;
}

const CHANGE_PASSWORD_MUTATION = `
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

export async function changePassword(input: ChangePasswordInputDTO): Promise<boolean> {
  const data = await executeGraphQL<
    { changePassword: boolean },
    { input: ChangePasswordInputDTO }
  >(CHANGE_PASSWORD_MUTATION, { input });
  return data.changePassword;
}
