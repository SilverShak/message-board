<html>

<head>

<link rel="stylesheet" href="style/style.css">
<link rel="stylesheet" href="style/forms.css">
<link rel="shortcut icon" href="#">
</head>

<body>

<div id="overlay" onClick="startActivity()">
	<div id="overlayText">Click to start</div>
</div>

<div class="headerArea">
<span class="headerTitle">הודעות<span>
</div>
<hr>
<button id="messageAdd" href="#" class="btn">הוספה</button>
&nbsp;&nbsp;
<input type="checkbox" id="get_all">
<label for="get_all">כל ההודעות</label>

<div id="messageArea"> </div>

<div class="form-popup" id="formEditDiv">
  <form id="formEdit" method="post" action="" class="form-container">
    <h3 id="editAction"></h3>

	<input type="hidden" id="editID">
	
	<label for="editCategory">קטגוריה:</label>
	<select id="editCategory">
		<option value="כללי">כללי</option>
		<option value="NSOC">NSOC</option>
	</select>
	<br>
	
    <label for="editMessage"><b>הודעה</b></label>
    <br>
	<pre><textarea id="editMessage" rows="7" cols="auto" form="formEdit" autocomplete="off" maxlength="350" required> </textarea></pre>
	<br>
	<label for="editExpiration">תאריך תפוגה:</label>
	<input type="date" id="editExpiration" placeholder="dd/mm/yyyy" required><br>
	
	<label for="editAuthor"><b>שם הכותב</b></label>
    <input type="text" id="editAuthor" autocomplete="off" maxlength="15" required>
	
    <button type="submit" id="editSave" href="#" class="btn" onsubmit="return false">שמירה</button>
    <button type="button" id="editClose" class="btn cancel">ביטול</button>
  </form>
</div>


<script src="main.js"></script>
</body>
</html>