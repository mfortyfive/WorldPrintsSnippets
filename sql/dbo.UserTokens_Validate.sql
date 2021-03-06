USE [WorldPrints]
GO
/****** Object:  StoredProcedure [dbo].[UserToken_Validate]    Script Date: 11/30/2021 10:23:32 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[UserToken_Validate]
		@token nvarchar(100)


/* TEST CODE 
	
DECLARE @token nvarchar(100) = '98F0B59D-575C-41C2-B91E-5F11335B9BE1'
EXECUTE dbo.UserToken_Validate
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
			DELETE dbo.UserTokens
			WHERE Token = @token
	END
	ELSE
	BEGIN
		;THROW 50500, 'Invalid Token', 1
	END

END
