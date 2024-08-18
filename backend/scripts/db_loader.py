import sqlite3 as db
import pandas as pd
# create connection to bioverse_app.db
conn = db.connect("backend/bioverse_app.db")

cursor = conn.cursor()

# questionnaire_questionnaires (questionnaire id, questionnaire name)
create_questionnaire_table = """
CREATE TABLE IF NOT EXISTS questionnaires (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL
);
"""
cursor.execute(create_questionnaire_table)

# questionnaire_questions (question id, question string object)
create_question_table = """
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    question JSON NOT NULL
);
"""
cursor.execute(create_question_table)

# questionnaire_junction (question id, questionnaire id, priority)
create_junction_table = """
CREATE TABLE IF NOT EXISTS junction (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    question_id INTEGER NOT NULL, 
    questionnaire_id INTEGER NOT NULL, 
    priority INTEGER NOT NULL, 
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (id), 
    FOREIGN KEY (question_id) REFERENCES questions (id)
);
"""
cursor.execute(create_junction_table)

# users_answers (answer id, user id, user email, questionnaire id, question id, question type, answer)
create_user_answer_table = """
CREATE TABLE IF NOT EXISTS users_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_email TEXT,
    question_id INTEGER,
    question_type TEXT,
    answer TEXT,
    FOREIGN KEY (question_id) REFERENCES questions (id),
    UNIQUE(user_id, question_id) 
);
"""
cursor.execute(create_user_answer_table)

def insert_questionnaire_table():
    df = pd.read_csv('backend/scripts/questionnaire_questionnaires.csv')
    df.to_sql('questionnaires', conn, if_exists='replace', index=False)

def insert_question_table():
    df = pd.read_csv('backend/scripts/questionnaire_questions.csv')
    df.to_sql('questions', conn, if_exists='replace', index=False)

def insert_junction_table():
    df = pd.read_csv('backend/scripts/questionnaire_junction.csv')
    df.to_sql('junction', conn, if_exists='replace', index=False)


print("\n\n")
insert_questionnaire_table()
print("\n")
insert_question_table()
print("\n")
insert_junction_table()

conn.close()
    