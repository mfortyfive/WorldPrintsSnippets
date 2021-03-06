USE [WorldPrints]
GO
/****** Object:  StoredProcedure [dbo].[Users_Confirm]    Script Date: 11/30/2021 10:24:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROC [dbo].[Users_Confirm]
		@token nvarchar(100)

/* TEST CODE 
	
-- DECLARE @token nvarchar(100) = NEWID()
DECLARE @token nvarchar(100) = '98F0B59D-575C-41C2-B91E-5F11335B9BE1'
EXECUTE dbo.UserToken_Confirm
		@token
EXECUTE dbo.UserToken_SelectAll

*/

AS

BEGIN

	DECLARE @userId int = (SELECT UserId
				FROM dbo.UserTokens
				WHERE Token = @token)

	IF (@userId IS NOT NULL)
	BEGIN
		UPDATE dbo.Users
			SET  [isConfirmed] = 1
			WHERE Id = @userId
		EXECUTE dbo.Users_UpdateStatus
				@userId
				,2
		EXECUTE dbo.UserToken_Delete
				@token
	END
	ELSE
	BEGIN
		;THROW 50500, 'Invalid Token', 1
	END

END
