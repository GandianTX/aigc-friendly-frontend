// src/features/admin-auth/infrastructure/dto.ts

export interface LoginInputDTO {
  readonly loginName: string;
  readonly loginPassword: string;
  readonly type: string;
  readonly audience: string;
}

export interface LoginResultDTO {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly accountId: number;
  readonly role: string;
  readonly userInfo: UserInfoDTO | null;
}

export interface UserInfoDTO {
  readonly id: number;
  readonly accountId: number;
  readonly nickname: string | null;
  readonly avatarUrl: string | null;
  readonly email: string | null;
}

export interface ChangePasswordInputDTO {
  readonly oldPassword: string;
  readonly newPassword: string;
}
