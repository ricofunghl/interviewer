
import json
import openai
from typing import List, Dict, Any
from .config import settings

# Configure OpenAI
openai.api_key = settings.openai_api_key


class AIService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
    
    def generate_interview_questions(self, job_description: str, job_title: str) -> List[Dict[str, Any]]:
        """Generate interview questions based on job description"""
        
        prompt = f"""
        Based on this job description for a {job_title} role, generate a mock interview with 8 questions.
        
        Job Description:
        {job_description}
        
        Please generate:
        - 3 behavioral questions (focusing on past experiences, teamwork, problem-solving)
        - 5 technical questions (specific to the role and skills mentioned)
        
        For each question, provide:
        - question_text: The actual question
        - question_type: "behavioral" or "technical"
        - order_index: The order in which to ask (1-8)
        
        Return the questions as a JSON array.
        """
        
        try:
            '''enable this when you want to use the openai api'''
            # response = self.client.chat.completions.create(
            #     model="gpt-4",
            #     messages=[
            #         {"role": "system", "content": "You are an expert HR professional and technical interviewer."},
            #         {"role": "user", "content": prompt}
            #     ],
            #     temperature=0.7,
            #     max_tokens=1000
            # )
            
            # Parse the response and extract questions
            # content = response.choices[0].message.content
            '''enable this when you want to use the openai api'''

            # You might need to add JSON parsing logic here
            # For now, returning a structured format
            
            questions = [
                {
                    "question_text": "Tell me about a challenging project you worked on and how you overcame obstacles.",
                    "question_type": "behavioral",
                    "order_index": 1
                },
                {
                    "question_text": "Describe a time when you had to work with a difficult team member.",
                    "question_type": "behavioral", 
                    "order_index": 2
                },
                {
                    "question_text": "How do you handle tight deadlines and competing priorities?",
                    "question_type": "behavioral",
                    "order_index": 3
                }
            ]
            
            # Add technical questions based on job title
            technical_questions = self._generate_technical_questions(job_title, job_description)
            questions.extend(technical_questions)
            
            return questions
            
        except Exception as e:
            print(f"Error generating questions: {e}")
            return []
    
    def _generate_technical_questions(self, job_title: str, job_description: str) -> List[Dict[str, Any]]:
        """Generate technical questions based on job title and description"""
        
        # This is a simplified version - in production, you'd use AI to generate these
        technical_questions = []
        
        if "software" in job_title.lower() or "developer" in job_title.lower():
            technical_questions = [
                {
                    "question_text": "Explain the difference between REST and GraphQL APIs.",
                    "question_type": "technical",
                    "order_index": 4
                },
                {
                    "question_text": "How would you optimize a slow database query?",
                    "question_type": "technical",
                    "order_index": 5
                },
                {
                    "question_text": "Describe your experience with version control systems like Git.",
                    "question_type": "technical",
                    "order_index": 6
                },
                {
                    "question_text": "How do you approach debugging a production issue?",
                    "question_type": "technical",
                    "order_index": 7
                },
                {
                    "question_text": "What's your experience with testing methodologies?",
                    "question_type": "technical",
                    "order_index": 8
                }
            ]
        else:
            # Generic technical questions
            technical_questions = [
                {
                    "question_text": "What tools and technologies are you most proficient with?",
                    "question_type": "technical",
                    "order_index": 4
                },
                {
                    "question_text": "How do you stay updated with industry trends?",
                    "question_type": "technical",
                    "order_index": 5
                },
                {
                    "question_text": "Describe a technical problem you solved recently.",
                    "question_type": "technical",
                    "order_index": 6
                },
                {
                    "question_text": "How do you approach learning new technologies?",
                    "question_type": "technical",
                    "order_index": 7
                },
                {
                    "question_text": "What's your experience with project management tools?",
                    "question_type": "technical",
                    "order_index": 8
                }
            ]
        
        return technical_questions
    
    def evaluate_response(self, question: str, response: str, question_type: str) -> Dict[str, Any]:
        """Evaluate a user's response and provide feedback"""
        
        prompt = f"""
        As an expert interviewer, evaluate this response to the following question:
        
        Question: {question}
        Question Type: {question_type}
        Response: {response}
        
        Please provide:
        1. A score from 1-10 (where 10 is excellent)
        2. Constructive feedback highlighting strengths and areas for improvement
        3. Specific suggestions for better responses
        
        Format your response as JSON with keys: score, feedback, suggestions
        """
        
        try:
            '''enable this when you want to use the openai api'''
            # response_ai = self.client.chat.completions.create(
            #     model="gpt-4",
            #     messages=[
            #         {"role": "system", "content": "You are an expert interviewer providing constructive feedback."},
            #         {"role": "user", "content": prompt}
            #     ],
            #     temperature=0.5,
            #     max_tokens=500
            # )
            # content = response_ai.choices[0].message.content
            '''enable this when you want to use the openai api'''
            
            # For now, return a structured response
            # In production, you'd parse the JSON response
            return {
                "score": 7.5,  # Placeholder score
                "feedback": "Good response with room for improvement. Consider providing more specific examples.",
                "suggestions": [
                    "Include specific metrics or outcomes",
                    "Use the STAR method for behavioral questions",
                    "Provide concrete examples"
                ]
            }
            
        except Exception as e:
            print(f"Error evaluating response: {e}")
            return {
                "score": 5.0,
                "feedback": "Unable to evaluate response at this time.",
                "suggestions": []
            }
    
    def generate_interview_feedback(self, interview_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate overall interview feedback"""
        
        prompt = f"""
        Based on this interview data, provide comprehensive feedback:
        
        Job Title: {interview_data.get('job_title', 'Unknown')}
        Questions and Responses: {interview_data.get('responses', [])}
        
        Please provide:
        1. Overall score (1-10)
        2. Summary of performance
        3. Key strengths
        4. Areas for improvement
        5. Recommendations for future interviews
        """
        
        try:
            '''enable this when you want to use the openai api'''
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert career coach providing interview feedback."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=800
            )
            # content = response.choices[0].message.content
            '''enable this when you want to use the openai api'''
            
            return {
                "overall_score": 7.0,
                "summary": "Good performance with room for improvement in technical areas.",
                "strengths": ["Clear communication", "Good behavioral examples"],
                "improvements": ["More technical depth", "Better STAR method usage"],
                "recommendations": ["Practice technical questions", "Prepare more examples"]
            }
            
        except Exception as e:
            print(f"Error generating feedback: {e}")
            return {
                "overall_score": 5.0,
                "summary": "Unable to generate feedback at this time.",
                "strengths": [],
                "improvements": [],
                "recommendations": []
            } 