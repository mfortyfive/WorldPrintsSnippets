USE [WorldPrints]
GO
/****** Object:  StoredProcedure [dbo].[UserToken_Insert_Registration]    Script Date: 11/30/2021 10:22:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[UserToken_Insert_Registration]
		 @userId int
		,@token nvarchar(100)

/* TEST CODE 
	
DECLARE @userId int = 4
		,@token nvarchar(100) = NEWID()
EXECUTE dbo.UserToken_Insert_Registration
		@userId
		,@token
EXECUTE dbo.UserToken_Select_ByUserId
		@userId

*/

AS

BEGIN

	DECLARE @isConfirmed bit = (SELECT IsConfirmed
									FROM dbo.Users
									WHERE Id = @userId)
							
    IF (@isConfirmed <> 1)
	BEGIN
		IF EXISTS (SELECT 1
						FROM dbo.UserTokens
						WHERE (UserId = @userId AND TokenType = 1))
		BEGIN
			UPDATE dbo.UserTokens
				SET Token = @token
				WHERE (UserId = @userId AND TokenType = 1)
		END
		ELSE
		BEGIN
			INSERT INTO dbo.UserTokens
						(UserId
						,TokenType
						,Token)
			VALUES 
						(@userId
						,1
						,@token)
		END
	END
	ELSE
	BEGIN
		;THROW 50500, 'User is already confirmed', 1
	END

END
