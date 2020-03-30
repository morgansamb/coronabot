const request = require('request');
const Discord = require('discord.js');

module.exports = {
	name: 'corona',
	description: 'Get statistics about COVID-19 Pandemia in a specific country',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`Précises le nom d'un pays ${message.author} !`);
		}

		const country = args[0];

		request(`https://corona.lmao.ninja/countries/${country}`, { json: true }, (err, res, body) => {
			if (err) {
				return message.channel.send('Une erreur est survenue durant le traitement de la demande');
			}

			if (body.country == null) { return message.channel.send('Pays saisi non trouvé ou aucune donnée disponible'); }

			const date = new Date(body.updated);
			const correctMonth = date.getMonth() + 1;
			const month = correctMonth.length > 1 ? correctMonth : `0${correctMonth}`;
			const frenchDate = `${date.getDate()}/${month}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

			const embed = new Discord.MessageEmbed()
				.setColor('#ab47bc')
				.setTitle(`Statistiques pour ${body.country}`)
				.setAuthor('CoronaBot', 'https://i.pinimg.com/originals/df/b3/30/dfb330a23375fe6264ae2e175b9fe2db.gif', '')
				.setThumbnail(body.countryInfo.flag)
				.addFields(
					{ name: 'Nombre total de cas', value: body.cases },
					{ name: 'Actifs', value: body.active, inline: true },
					{ name: 'Critiques', value: body.critical, inline: true },
					{ name: 'Décès', value: body.deaths, inline: true },
					{ name: 'Soignés', value: body.recovered, inline: true },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Nouveau cas aujourd\'hui', value: body.todayCases },
					{ name: 'Nombre de décès aujourd\'hui', value: body.todayDeaths },
				)
				.setFooter(`Dernière mise à jour : ${frenchDate}`);
			return message.channel.send(embed);
		});
	},
};
