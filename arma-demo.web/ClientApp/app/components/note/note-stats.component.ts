import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { NoteService } from '../../services/note.service';
import { NoteStat } from '../../models/note-stat';

@Component({
    selector: 'note-stats',
    templateUrl: 'note-stats.component.html',
    styleUrls: ['note-stats.component.css']
})
export class NoteStatsComponent implements AfterViewInit {
    @ViewChild('container') container: ElementRef;

    size = 360;
    radius = this.size / 2;
    donutWidth = 75;
    color = d3.scaleOrdinal(d3.schemeCategory20c);
    legendRectSize = 18;
    legendSpacing = 4;
    arc: d3.Arc<any, d3.PieArcDatum<NoteStat>>;
    pie: d3.Pie<any, NoteStat>;

    constructor(public note: NoteService) {
        this.arc = d3.arc<d3.PieArcDatum<NoteStat>>()
            .innerRadius(this.radius - this.donutWidth)
            .outerRadius(this.radius);

        this.pie = d3.pie<NoteStat>()
            .value(d => d.count)
            .sort(null);
    }

    ngAfterViewInit() {
        this.note.noteStats.subscribe(notes => {
            this.renderStats(notes);
        });

        this.note.getNoteStats();
    }

    renderStats(notes: Array<NoteStat>) {
        const svg = d3.select(this.container.nativeElement)
            .attr('width', this.size)
            .attr('height', this.size)
            .append('g')
            .attr('transform', `translate(${this.radius}, ${this.radius})`);

        const arcPaths = svg.datum(notes).selectAll('path')
            .data(this.pie(notes))
            .enter()
            .append('path')
            .attr('fill', 'rgba(255,255,255,0)')
            .attr('d', this.arc);

        arcPaths.transition().duration(350).attr('fill', (d) => this.color(d.data.category));

        arcPaths.exit().transition().duration(350).remove();

        const legend = svg.selectAll('.legend')
            .data(this.color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => {
                const height = this.legendRectSize + this.legendSpacing;
                const offset = height * this.color.domain().length / 2;
                const horz = -2 * this.legendRectSize;
                const vert = i * height - offset;
                return `translate(${horz}, ${vert})`;
            });

        legend.append('rect')
            .attr('width', this.legendRectSize)
            .attr('height', this.legendRectSize)
            .style('fill', this.color)
            .style('stroke', this.color);

        legend.append('text')
            .attr('x', this.legendRectSize + this.legendSpacing)
            .attr('y', this.legendRectSize - this.legendSpacing)
            .text((d) => d);

        legend.exit().remove();
    }
}
