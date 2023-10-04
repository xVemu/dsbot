export default {
  name: 'rps',
  description: 'Play rock, paper, scissors.',
  async execute(msg) {
    const choices = ['rock', 'paper', 'scissors'];
    const userChoice = choices[Math.floor(Math.random() * 3)];
    const botChoice = choices[Math.floor(Math.random() * 3)];

    let result;

    if (userChoice === botChoice) {
      result = 'It\'s a tie!';
    } else if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      result = 'You win!';
    } else {
      result = 'I win!';
    }

    await msg.reply(`You chose ${userChoice}, and I chose ${botChoice}. ${result}`);
  },
};
