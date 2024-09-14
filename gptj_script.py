import sys
from transformers import GPTJForCausalLM, GPT2Tokenizer

# Load pre-trained model and tokenizer
model_name = 'EleutherAI/gpt-j-6B'
model = GPTJForCausalLM.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)

def generate_response(prompt):
    inputs = tokenizer(prompt, return_tensors='pt')
    outputs = model.generate(**inputs, max_length=50)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

if __name__ == '__main__':
    prompt = sys.argv[1]
    response = generate_response(prompt)
    print(response)
