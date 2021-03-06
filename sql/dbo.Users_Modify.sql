USE [WorldPrints]
GO
/****** Object:  StoredProcedure [dbo].[Users_Update_V2]    Script Date: 11/30/2021 10:21:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROC [dbo].[Users_Update_V2]
		 @Email nvarchar(100)
		,@Password varchar(100)
		,@Role nvarchar(50)
		,@Id int

/* TEST CODE

DECLARE  @Email nvarchar(100) = 'test@email.com'
		,@Password varchar(100) = 'psWord1027!'
		,@Role nvarchar(50) = 'user'
		,@Id int = 1

EXECUTE dbo.Users_Update_V2
		 @Email
		,@Password
		,@Role
		,@Id

EXECUTE dbo.Users_Select_ById
		@Id

*/

AS

BEGIN

	UPDATE dbo.Users
		SET  [Email] = @Email
			,[Password] = @Password
			,[RoleId] = (SELECT Id
									FROM dbo.Roles
									WHERE [Name] = @Role)
		WHERE Id = @Id

END

